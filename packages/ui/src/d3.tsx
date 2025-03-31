'use client';
import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';

/**
 * Represents a node in the network graph.
 * @interface
 */
interface NodeData extends d3.SimulationNodeDatum {
  /** Unique identifier for the node. */
  id: string;
  /** Group identifier for coloring or categorization. */
  group: number;
}

/**
 * Represents a link between two nodes in the network graph.
 * @interface
 */
interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  /** The source node ID or object. */
  source: string | NodeData;
  /** The target node ID or object. */
  target: string | NodeData;
  /** Value associated with the link, potentially affecting its appearance or simulation. */
  value: number;
}

/**
 * Represents the data structure for the network graph.
 * @interface
 */
interface NetworkData {
  /** Array of nodes. */
  nodes: NodeData[];
  /** Array of links. */
  links: LinkData[];
}

/**
 * Props for the D3NetworkGraph component.
 * @interface
 */
interface D3NetworkGraphProps {
  /** The network data containing nodes and links. */
  data: NetworkData;
  /** The width of the SVG container. Defaults to 600. */
  width?: number;
  /** The height of the SVG container. Defaults to 400. */
  height?: number;
}

/**
 * A React component rendering an interactive D3 force-directed network graph.
 * Uses MUI's Box component for layout.
 *
 * @param {D3NetworkGraphProps} props - The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const D3NetworkGraph: React.FC<D3NetworkGraphProps> = ({
  data,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Memoize data to prevent unnecessary re-renders if the object reference is the same
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!svgRef.current || !memoizedData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Make copies of data to avoid mutating props
    const nodes = memoizedData.nodes.map((d) => ({ ...d }));
    const links = memoizedData.links.map((d) => ({ ...d }));

    // Set up the simulation
    const simulation = d3
      .forceSimulation<NodeData>(nodes)
      .force(
        'link',
        d3
          .forceLink<NodeData, LinkData>(links)
          .id((d) => d.id)
          .distance(50), // Adjust link distance
      )
      .force('charge', d3.forceManyBody().strength(-100)) // Adjust repulsion strength
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(12)); // Prevent node overlap

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add links (lines)
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    // Add nodes (circles)
    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGCircleElement, NodeData>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8) // Node radius
      .attr('fill', (d) => color(d.group.toString()))
      .call(drag(simulation)); // Enable dragging

    // Add tooltips (optional)
    node.append('title').text((d) => d.id);

    // Define the tick function to update positions
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as NodeData).x ?? 0)
        .attr('y1', (d) => (d.source as NodeData).y ?? 0)
        .attr('x2', (d) => (d.target as NodeData).x ?? 0)
        .attr('y2', (d) => (d.target as NodeData).y ?? 0);

      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
    });

    // Drag behavior
    function drag(
      simulationInstance: d3.Simulation<NodeData, undefined>,
    ): d3.DragBehavior<
      SVGCircleElement,
      NodeData,
      NodeData | d3.SubjectPosition
    > {
      function dragstarted(
        event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>,
      ) {
        if (!event.active) simulationInstance.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(
        event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>,
      ) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(
        event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>,
      ) {
        if (!event.active) simulationInstance.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag<SVGCircleElement, NodeData>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // Clean up simulation on component unmount
    return () => {
      simulation.stop();
    };
  }, [memoizedData, width, height]); // Rerun effect if data or dimensions change

  return (
    <Box sx={{ border: '1px solid lightgray', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      />
    </Box>
  );
};

D3NetworkGraph.displayName = 'D3NetworkGraph';

export { D3NetworkGraph };
// No sample data needed. The existing component structure is sound.
// Potential improvements could involve adding more interactivity (zoom/pan),
// further customization options (colors, forces), responsiveness,
// or accessibility features, depending on specific requirements.
// The current implementation provides a solid foundation for a reusable
// D3 network graph component in React.
