import MenuInConversation from "./etal_menus/MenuInConversation";
import { PanelRightOpen } from "lucide-react";
import { Affix, Button, Drawer, Tabs, Text, Title } from "@mantine/core";
import { useEffect, useRef } from "react";

function NetworkMenus({ isOpen, setIsOpen, onWidthChange }) {
  const drawerRootRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const drawer = drawerRootRef.current?.querySelector(".citationDrawer");
    if (!drawer) return undefined;

    function reportWidth() {
      onWidthChange(drawer.getBoundingClientRect().width);
    }

    reportWidth();
    const observer = new ResizeObserver(reportWidth);
    observer.observe(drawer);
    return () => observer.disconnect();
  }, [isOpen, onWidthChange]);

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }} zIndex={10}>
        <Button
          radius="xl"
          variant="light"
          leftSection={<PanelRightOpen size={18} aria-hidden="true" />}
          aria-label="Open conversation citations"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          Citations
        </Button>
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
          content: "citationDrawer",
          header: "citationDrawerHeader",
          body: "citationDrawerBody",
        }}
        title={
          <div>
            <Text c="milkyPurple.4" fw={700} size="xs" tt="uppercase">
              Explore
            </Text>
            <Title order={2} size="h4">
              Conversation citations
            </Title>
          </div>
        }
      >
        <Tabs defaultValue="oracle" keepMounted={false}>
          <Tabs.List grow mb="md">
            <Tabs.Tab value="oracle">Oracle</Tabs.Tab>
            <Tabs.Tab value="internal">Internal</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="oracle">
            <MenuInConversation oracleMode={true} />
          </Tabs.Panel>
          <Tabs.Panel value="internal">
            <MenuInConversation oracleMode={false} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  );
}

export default NetworkMenus;
