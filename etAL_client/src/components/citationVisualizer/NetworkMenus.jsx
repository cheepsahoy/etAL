import MenuInConversation from "./Etal-Menus/MenuInConversation";

function NetworkMenus({ etAlData, selectedArticle, setSelectedArticle }) {
  return (
    <div
      className="dataViewers"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: "1",
      }}
    >
      <MenuInConversation
        etAlData={etAlData}
        setSelectedArticle={setSelectedArticle}
      />
    </div>
  );
}

export default NetworkMenus;
