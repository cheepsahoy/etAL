import {
    Affix,
    Button,
    Collapse,
    Divider,
    Group,
    Paper,
    Stack,
    Table,
    Text,
    Title,
    Tooltip,
    UnstyledButton,
} from '@mantine/core'
import {ChevronDown, ChevronUp} from 'lucide-react'
import {useState} from 'react'
import useNetworkGraphContext from '../../hooks/useNetworkGraphContext'

function displayValue(value, fallback) {
    return value && value !== 'No DOI on record' ? value : fallback
}

function publicationYear(publicationDate) {
    const year = String(publicationDate ?? '').match(/\b\d{4}\b/)
    return year?.[0] ?? 'Year unavailable'
}

function DetailToggle({expanded, onClick}) {
    return (
        <Group gap="xs" wrap="nowrap">
            <Divider style={{flex: 1}} />
            <UnstyledButton
                type="button"
                onClick={onClick}
                aria-expanded={expanded}
                aria-controls="selected-work-details">
                <Group gap={3} wrap="nowrap">
                    <Text c="milkyPurple.3" fw={600} size="xs">
                        {expanded ? 'Less Detail' : 'More Detail'}
                    </Text>
                    {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </Group>
            </UnstyledButton>
            <Divider style={{flex: 1}} />
        </Group>
    )
}

function SelectedArticleViewBox({leftOffset = 'var(--mantine-spacing-lg)'}) {
    const [expandedArticleId, setExpandedArticleId] = useState(null)
    const {data, selectedArticle} = useNetworkGraphContext()
    const article = selectedArticle?.id ? data?.citation_conversation?.[selectedArticle.id] : null
    const isExpanded = expandedArticleId === article?.id
    const citedByCount = Number.isFinite(article?.centrality_score) ? article.centrality_score : 0
    const citingCount = Number.isFinite(article?.oracle_score) ? article.oracle_score + 1 : 0
    const authors = Object.keys(article?.authors ?? {}).join(', ') || 'No authors on record'

    const details = article
        ? [
              ['Source', displayValue(article.source, 'No primary source on record')],
              ['DOI', displayValue(article.doi, 'No DOI on record')],
          ]
        : []

    return (
        <Affix
            className="selectedArticleViewBox"
            position={{
                top: 'calc((var(--mantine-spacing-lg) * 2) + 42px + var(--mantine-spacing-md))',
                left: leftOffset,
            }}
            zIndex={4}>
            <Paper component="aside" aria-live="polite" p="sm" radius="md" shadow="md" withBorder>
                {article ? (
                    <Stack gap={4}>
                        <Group gap={4} wrap="nowrap">
                            <Text c="milkyPurple.4" fw={700} size="xs" tt="uppercase">
                                Selected Work
                            </Text>
                            <Tooltip
                                label="Citations are works in this graph that cite the selected work. References are works in this graph cited by the selected work."
                                multiline
                                w={280}
                                withArrow>
                                <Text
                                    component="span"
                                    c="amberPulse.4"
                                    fw={700}
                                    size="xs"
                                    aria-label="Explain citation counts">
                                    [?]
                                </Text>
                            </Tooltip>
                        </Group>
                        <Title order={2} size="sm">
                            {displayValue(article.title, 'No title on record')}
                        </Title>
                        <Text size="xs" c="dimmed">
                            {authors} * {publicationYear(article.pub_date)}
                        </Text>
                        <Text size="xs" c="dimmed">
                            Citing{' '}
                            <Text component="span" inherit c="amberPulse.4" fw={700}>
                                {citedByCount.toLocaleString()}
                            </Text>{' '}
                            {' * '} Cited by{' '}
                            <Text component="span" inherit c="oracleGreen.5" fw={700}>
                                {citingCount.toLocaleString()}
                            </Text>
                        </Text>
                        <Collapse in={isExpanded} transitionDuration={260} transitionTimingFunction="ease">
                            <Table
                                id="selected-work-details"
                                layout="fixed"
                                withRowBorders={false}
                                horizontalSpacing={0}
                                verticalSpacing={3}
                                mt={4}>
                                <Table.Tbody>
                                    {details.map(([label, value]) => (
                                        <Table.Tr key={label}>
                                            <Table.Th w={104} fz="xs" style={{verticalAlign: 'top'}}>
                                                {label}
                                            </Table.Th>
                                            <Table.Td fz="xs" style={{overflowWrap: 'anywhere'}}>
                                                {value}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                            <Group gap="xs" justify="center" mt="xs">
                                <Button
                                    component="a"
                                    size="xs"
                                    variant="light"
                                    href={`https://openalex.org/${article.id}`}
                                    target="_blank"
                                    rel="noreferrer">
                                    OpenAlex ↗
                                </Button>
                                <Button size="xs" variant="default" disabled>
                                    Works Cited ↗
                                </Button>
                            </Group>
                        </Collapse>
                        <DetailToggle
                            expanded={isExpanded}
                            onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                        />
                    </Stack>
                ) : (
                    <Text size="xs" c="dimmed">
                        No Selected Work
                    </Text>
                )}
            </Paper>
        </Affix>
    )
}

export default SelectedArticleViewBox
