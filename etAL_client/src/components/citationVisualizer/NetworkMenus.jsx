import MenuInConversation from "./Etal-Menus/MenuInConversation";

function NetworkMenus({ etAlData, selectedArticle, setSelectedArticle }) {
  return (
    <div
      className="dataViewers"
      style={{
        display: "flex",
        flexDirection: "row",
        flex: "1",
      }}
    >
      <MenuInConversation
        oracleMode={false}
        etAlData={etAlData}
        setSelectedArticle={setSelectedArticle}
      />
      <MenuInConversation
        oracleMode={true}
        etAlData={etAlData}
        setSelectedArticle={setSelectedArticle}
      />
    </div>
  );
}

export default NetworkMenus;
