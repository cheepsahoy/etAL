import MenuInConversation from '../citation_menus/MenuInConversation'
import MenuOracles from '../citation_menus/MenuOracles'
import {PanelRightOpen} from 'lucide-react'
import {ActionIcon, Affix, Drawer, Group, Tabs, Text, Tooltip} from '@mantine/core'
import {useEffect, useRef} from 'react'

function NetworkMenus({isOpen, setIsOpen, onWidthChange}) {
    const drawerRootRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return undefined

        const drawer = drawerRootRef.current?.querySelector('.citationDrawer')
        if (!drawer) return undefined

        function reportWidth() {
            onWidthChange(drawer.getBoundingClientRect().width)
        }

        reportWidth()
        const observer = new ResizeObserver(reportWidth)
        observer.observe(drawer)
        return () => observer.disconnect()
    }, [isOpen, onWidthChange])

    return (
        <>
            <Affix position={{top: '50%', right: 20}} zIndex={10} style={{transform: 'translateY(-50%)'}}>
                <ActionIcon
                    size="lg"
                    radius="xl"
                    variant="light"
                    aria-label="Explore the citations of your selected article"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(true)}>
                    <PanelRightOpen size={18} aria-hidden="true" />
                </ActionIcon>
            </Affix>

            <Drawer
                ref={drawerRootRef}
                opened={isOpen}
                onClose={() => setIsOpen(false)}
                position="right"
                size="min(440px, 88vw)"
                padding="lg"
                withOverlay={false}
                trapFocus={false}
                lockScroll={false}
                returnFocus={false}
                closeOnClickOutside={false}
                classNames={{
                    content: 'citationDrawer',
                    header: 'citationDrawerHeader',
                    body: 'citationDrawerBody',
                }}
                title={
                    <div>
                        <Text c="milkyPurple.4" fw={700} size="xs" tt="uppercase">
                            Explore the Citations
                        </Text>
                    </div>
                }>
                <Tabs defaultValue="internal" keepMounted={false}>
                    <Tabs.List grow mb="md">
                        <Tabs.Tab value="internal">Ordered By Citations</Tabs.Tab>
                        <Tabs.Tab value="oracle">
                            <Group component="span" gap={4} wrap="nowrap">
                                <span>Ordered By Oracle</span>
                                <Tooltip
                                    label="Oracles are the term we use to describe the works that determine the most important players in a scholarly conversation. The higher an oracle score, the more players in the conversation are cited by the selected work."
                                    position="bottom"
                                    multiline
                                    w={280}
                                    withArrow>
                                    <Text
                                        component="span"
                                        c="amberPulse.4"
                                        fw={700}
                                        aria-label="Explains what an Oracle means in EtAl ">
                                        [?]
                                    </Text>
                                </Tooltip>
                            </Group>
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="oracle">
                        <MenuOracles />
                    </Tabs.Panel>
                    <Tabs.Panel value="internal">
                        <MenuInConversation />
                    </Tabs.Panel>
                </Tabs>
            </Drawer>
        </>
    )
}

export default NetworkMenus
