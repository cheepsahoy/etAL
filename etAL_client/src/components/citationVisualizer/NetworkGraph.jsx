import * as d3 from 'd3'
import {useRef, useEffect, useMemo} from 'react'
import useNetworkGraphContext from '../../hooks/useNetworkGraphContext'
import NetworkLoadingOverlay from './NetworkLoadingOverlay'

//
function nodeAndLinkMaker(data) {
    const uniqueIDs = data.sorted_citation_conversation
    const nodes = []
    const links = []
    for (const id of uniqueIDs) {
        nodes.push(id)

        const outgoingIDs = Object.keys(id.outgoing_cites_internal)
        for (const outgoingCite of outgoingIDs) {
            const template = {
                source: id.id,
                target: outgoingCite,
            }
            links.push(template)
        }
    }

    return [nodes, links]
}

//calculate optimal size. premise is to use a 'rollingCircle' approach to imagine average size (this is a 'worst case scenario') thinking about the biggest canvas needed. most likely most circles will be size 10, not between 10 and 100. The function is composed of many helper functions to calculate angles and such but the final output is simply useable data for d3's radial force
function optimalSizeCalculator(nodes, buffer) {
    const sortedNodes = [...nodes].sort((a, b) => b.centrality_score - a.centrality_score)
    const centralityScores = nodes.map(node => node.centrality_score + 1)
    const centralityDomain = d3.extent(centralityScores)
    const sizeScale = d3.scaleLog().domain(centralityDomain).range([10, 100]) //this is a "magic number" bc I decided that this range from 10 and 100 looks nice

    function angleOutput(radiA, radiB, layerRadi) {
        const numerator = (radiA + layerRadi) ** 2 + (radiB + layerRadi) ** 2 - (radiA + radiB) ** 2

        const denominator = 2 * (layerRadi + radiA) * (layerRadi + radiB)

        const output = Math.acos(numerator / denominator)

        return output
    }

    function dictionaryUpdater(dictionary, currentRing) {
        const startingPosition = currentRing[0].startingPosition
        for (const circle of currentRing) {
            dictionary[circle.id] = startingPosition
        }
    }

    function circlePacker(sortedCircles, ringBuffer) {
        const radiusDictionary = {}
        //establish central node, it will be skipped in future calculations
        const centralNode = sortedCircles[0]
        const centralRadius = sizeScale(centralNode.centrality_score + 1)
        radiusDictionary[centralNode.id] = 0

        let currentRadius = centralRadius + ringBuffer
        let currentRing = []
        let firstOnRing
        let previousCircle
        let angleSum = 0

        if (sortedCircles.length === 1) {
            return [radiusDictionary, currentRadius]
        }

        for (let i = 1; i < sortedCircles.length; i++) {
            const id = sortedCircles[i].id
            const centrality_score = sortedCircles[i].centrality_score
            const circleRadius = sizeScale(centrality_score + 1)
            const circleObj = {
                id: id,
                circleRadius: circleRadius,
            }

            if (currentRing.length === 0) {
                circleObj.startingPosition = currentRadius + ringBuffer + circleRadius
                firstOnRing = circleObj
                previousCircle = circleObj
                currentRing.push(circleObj)
            } else {
                const incrementValue = angleOutput(circleObj.circleRadius, previousCircle.circleRadius, currentRadius)
                const closureValue = angleOutput(circleObj.circleRadius, firstOnRing.circleRadius, currentRadius)

                if (angleSum + incrementValue + closureValue <= 2 * Math.PI) {
                    angleSum += incrementValue
                    previousCircle = circleObj
                    currentRing.push(circleObj)
                } else {
                    angleSum = 0
                    dictionaryUpdater(radiusDictionary, currentRing)
                    const ringExtender = currentRing[0].circleRadius
                    currentRadius += 2 * ringExtender + ringBuffer
                    currentRing = []
                    circleObj.startingPosition = currentRadius + ringBuffer + circleRadius
                    firstOnRing = circleObj
                    previousCircle = circleObj
                    currentRing.push(circleObj)
                }
            }
        }
        if (currentRing.length !== 0) {
            dictionaryUpdater(radiusDictionary, currentRing)
        }
        return [radiusDictionary, currentRadius]
    }

    const [radiusDictionary, finalRadius] = circlePacker(sortedNodes, buffer)
    const dimensions = 2 * finalRadius
    return {
        radiusDictionary: radiusDictionary,
        maxRadius: finalRadius,
        width: dimensions,
        height: dimensions,
    }
}

function NetworkGraph() {
    const svgRef = useRef()

    const {data, selectedArticle, setArticle, loading} = useNetworkGraphContext()
    console.log('before render', selectedArticle)

    //useEffect for initial rendering
    useEffect(() => {
        console.log('we are drawing', data)

        //Early escape for empty props
        if (data === null) {
            console.log('we nulled')
            return
        }

        const centralArticleID = data.sorted_citation_conversation[0].id
        const [nodes, links] = nodeAndLinkMaker(data)

        const nodeBufferSize = 10
        const smallestNode = 10
        const largestNode = 100

        const sizes = optimalSizeCalculator(nodes, nodeBufferSize)
        const width = sizes.width
        const height = sizes.height

        console.log('caluclating width and height:', width, height)

        nodes.forEach(d => {
            if (d.id === centralArticleID) {
                d.fx = width / 2
                d.fy = height / 2
            }
        })

        const svg = d3
            .select(svgRef.current)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width * 2} ${height * 2}`)

        //clear previous content on new render
        svg.selectAll('*').remove()

        //the + 1 transformation is necessary bc centrality score very likely includes 0s. Whenever the scales are called add + 1 to their check
        const correctedDomainValue = d3.extent(nodes, d => d.centrality_score + 1)

        const colorScale = d3.scaleSequentialLog(d3.interpolatePlasma).domain(correctedDomainValue)

        const sizeScale = d3.scaleLog().domain(correctedDomainValue).range([smallestNode, largestNode]) //this is a "magic number" bc I decided that this range from 10 and 100 looks nice

        const idToNode = {}
        nodes.forEach(node => {
            idToNode[node.id] = node
        })
        const resolvedLinks = links.map(link => {
            const fixedEntry = {
                source: idToNode[link.source],
                target: idToNode[link.target],
            }
            return fixedEntry
        })

        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-width', 1.5)
            .selectAll('.link')
            .data(resolvedLinks)
            .join('line')
            .attr('class', d => `link source-${d.source} target-${d.target}`)
            .attr('pointer-events', 'none')

        const node = svg
            .append('g')
            .selectAll('.node')
            .data(nodes)
            .join('circle')
            .attr('r', d => sizeScale(d.centrality_score + 1))
            .style('fill', d => colorScale(d.centrality_score + 1))
            .attr('class', d => `node node-${d.id}`)

        const centerStrength = nodes.length > 2 ? 1 : 0 //with less than 2 the radial force is overwhelmed by the center force
        const simulation = d3
            .forceSimulation(nodes)
            .force(
                'collide',
                d3.forceCollide().radius(d => nodeBufferSize + sizeScale(d.centrality_score + 1)), //radius is hard coded based on range above, could be rendered more dynamically?
            )
            .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))
            .force(
                'radial',
                d3
                    .forceRadial(d => sizes.radiusDictionary[d.id], width / 2, height / 2)
                    .strength(d => {
                        return 0.9 //could be rendered more dynamically?
                    }),
            )

        // svg.on("click", (event) => {
        //   const clickTarget = event.target;
        //   if (clickTarget.matches(".node")) {
        //     const datum = d3.select(clickTarget).datum();
        //     const targetID = datum.id;
        //     setArticle(targetID);
        //   }
        // });

        simulation.on('tick', () => {
            node.attr('cx', d => d.x).attr('cy', d => d.y)

            link.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
        })

        return () => simulation.stop()
    }, [data])

    // Keep graph interaction independent from whether an article is selected.
    useEffect(() => {
        if (!data) {
            return
        }

        const graph = d3.select(svgRef.current)

        graph.on('click', event => {
            const clickTarget = event.target
            if (clickTarget.matches('.node')) {
                const datum = d3.select(clickTarget).datum()
                setArticle(datum.id)
            }
        })

        return () => graph.on('click', null)
    }, [data, setArticle])

    //useEffect for rehilghting on clicks
    useEffect(() => {
        if (!selectedArticle) {
            return
        }
        const targetID = selectedArticle.id
        const oracleStatus = selectedArticle.oracle
        if (targetID === null) {
            return
        }
        const graph = d3.select(svgRef.current)

        const citingObj = {}

        if (oracleStatus === true) {
            graph.selectAll('.link').classed('selectedLink', d => {
                if (d.source.id === targetID) {
                    citingObj[d.target.id] = true
                    return true
                } else {
                    return false
                }
            })

            graph
                .selectAll('.node')
                .classed('oracleNode', d => {
                    if (d.id === targetID) {
                        return true
                    } else {
                        return false
                    }
                })
                .classed('citedNode', false)
                .classed('citerNode', d => {
                    if (citingObj[d.id]) {
                        return true
                    } else {
                        return false
                    }
                })
        } else {
            graph.selectAll('.link').classed('selectedLink', d => {
                if (d.target.id === targetID) {
                    citingObj[d.source.id] = true
                    return true
                } else {
                    return false
                }
            })

            graph
                .selectAll('.node')
                .classed('oracleNode', false)
                .classed('citedNode', d => {
                    if (d.id === targetID) {
                        return true
                    } else {
                        return false
                    }
                })
                .classed('citerNode', d => {
                    if (citingObj[d.id]) {
                        return true
                    } else {
                        return false
                    }
                })
        }
    }, [selectedArticle])

    return (
        <div
            style={{
                width: '100%',
                height: '800px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: '4',
            }}
            className="visualization">
            {loading ? (
                <NetworkLoadingOverlay />
            ) : !data ? (
                <div>
                    <p>Waiting on selection...</p>
                </div>
            ) : null}

            <svg
                ref={svgRef}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    )
}

export default NetworkGraph
