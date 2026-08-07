import {Affix, Anchor, Paper, Stack, Table, Text, Title} from '@mantine/core'
import useNetworkGraphContext from '../../hooks/useNetworkGraphContext'

function displayValue(value, fallback) {
    return value && value !== 'No DOI on record' ? value : fallback
}

function SelectedArticleViewBox({leftOffset = 'var(--mantine-spacing-lg)'}) {
    const {data, selectedArticle} = useNetworkGraphContext()
    const article = selectedArticle?.id ? data?.citation_conversation?.[selectedArticle.id] : null
    const citedByCount = Number.isFinite(article?.centrality_score) ? article.centrality_score : 0
    const citingCount = Number.isFinite(article?.oracle_score) ? article.oracle_score + 1 : 0

    const details = article
        ? [
              ['Authors', Object.keys(article.authors ?? {}).join(', ') || 'No authors on record'],
              ['Published', displayValue(article.pub_date, 'No publication date on record')],
              ['Source', displayValue(article.source, 'No primary source on record')],
              ['DOI', displayValue(article.doi, 'No DOI on record')],
              [
                  'OpenAlex ID',
                  <Anchor
                      key={article.id}
                      size="xs"
                      href={`https://openalex.org/${article.id}`}
                      target="_blank"
                      rel="noreferrer">
                      {article.id}
                  </Anchor>,
              ],
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
            <Paper component="aside" aria-live="polite" p="md" radius="md" shadow="md" withBorder>
                {article ? (
                    <Stack gap="xs">
                        <Text c="milkyPurple.4" fw={700} size="xs" tt="uppercase">
                            Selected Article
                        </Text>
                        <Title order={2} size="md">
                            {displayValue(article.title, 'No title on record')}
                        </Title>
                        <Text size="sm" c="dimmed">
                            Cited by{' '}
                            <Text component="span" inherit c="amberPulse.4" fw={700}>
                                [{citedByCount.toLocaleString()}]
                            </Text>{' '}
                            and Citing{' '}
                            <Text component="span" inherit c="oracleGreen.5" fw={700}>
                                [{citingCount.toLocaleString()}]
                            </Text>{' '}
                            {citingCount > 1 ? 'works' : 'work'}
                        </Text>
                        <Table layout="fixed" withRowBorders={false} horizontalSpacing={0} verticalSpacing={4}>
                            <Table.Tbody>
                                {details.map(([label, value]) => (
                                    <Table.Tr key={label}>
                                        <Table.Th w={82} fz="xs" style={{verticalAlign: 'top'}}>
                                            {label}
                                        </Table.Th>
                                        <Table.Td fz="xs" style={{overflowWrap: 'anywhere'}}>
                                            {value}
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Stack>
                ) : (
                    <Text size="sm" c="dimmed">
                        No Selected Article
                    </Text>
                )}
            </Paper>
        </Affix>
    )
}

export default SelectedArticleViewBox
