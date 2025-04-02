'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';

// Represents a node in the network graph.
export interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

// Represents a link between two nodes in the network graph.
export interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  source: string | NodeData;
  target: string | NodeData;
  value: number;
}

// Represents the data structure for the network graph.
export interface NetworkData {
  nodes: NodeData[];
  links: LinkData[];
}

// Extend NodeData for agent-specific properties.
export interface AgentData extends NodeData {
  agentName: string;
  isAgent: boolean;
}

// Props for the D3NetworkGraph component.
export interface D3NetworkGraphProps {
  data: NetworkData;
  agentData?: AgentData[]; // Optional additional agent nodes.
  width?: number;
  height?: number;
}

const D3NetworkGraph: React.FC<D3NetworkGraphProps> = ({
  data,
  agentData,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Memoize data to prevent unnecessary re-renders.
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!svgRef.current || !memoizedData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Merge nodes from network data with agent data (if provided)
    const nodes = [
      ...memoizedData.nodes.map((d) => ({ ...d })),
      ...(agentData ? agentData.map((d) => ({ ...d })) : []),
    ];
    const links = memoizedData.links.map((d) => ({ ...d }));

    // Set up the simulation.
    const simulation = d3
      .forceSimulation<NodeData>(nodes)
      .force(
        'link',
        d3
          .forceLink<NodeData, LinkData>(links)
          .id((d) => d.id)
          .distance(50)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(12));

    // Create a color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add links.
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    // Add nodes.
    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGCircleElement, NodeData>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', (d) => {
        // If node is marked as an agent, use a distinct color.
        if ('isAgent' in d && (d as AgentData).isAgent) {
          return '#FFC107'; // Amber color for agent nodes.
        }
        return color(d.group.toString());
      })
      .call(drag(simulation));

    // Add tooltips.
    node.append('title').text((d) =>
      'isAgent' in d && (d as AgentData).isAgent ? (d as AgentData).agentName : d.id
    );

    // Update positions on each tick.
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as NodeData).x ?? 0)
        .attr('y1', (d) => (d.source as NodeData).y ?? 0)
        .attr('x2', (d) => (d.target as NodeData).x ?? 0)
        .attr('y2', (d) => (d.target as NodeData).y ?? 0);

      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
    });

    // Drag behavior.
    function drag(
      simulationInstance: d3.Simulation<NodeData, undefined>
    ): d3.DragBehavior<SVGCircleElement, NodeData, NodeData | d3.SubjectPosition> {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>) {
        if (!event.active) simulationInstance.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>) {
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

    // Clean up simulation on unmount.
    return () => {
      simulation.stop();
    };
  }, [memoizedData, agentData, width, height]);

  return (
    <Box sx={{ border: '1px solid lightgray', overflow: 'hidden' }}>
      <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} />
    </Box>
  );
};

D3NetworkGraph.displayName = 'D3NetworkGraph';

export { D3NetworkGraph };
export default D3NetworkGraph;
