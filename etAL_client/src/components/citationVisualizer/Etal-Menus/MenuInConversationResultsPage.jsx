import MenuInConversationCard from './MenuInConversationCard'

function MenuInConversationResultsPage({pageNumber, setPageNumber, subData}) {
    if (subData.length === 0) {
        return <p>Waiting on data...</p>
    } else {
        const lastPageIndex = subData.length - 1
        const relevantPage = subData[Math.min(pageNumber, lastPageIndex)]

        function backWardsHandler() {
            if (pageNumber === 0) {
                return
            } else {
                setPageNumber(prev => Math.max(prev - 1, 0))
            }
        }

        function forwardsHandler() {
            setPageNumber(prev => Math.min(prev + 1, lastPageIndex))
        }

        return (
            <div
                className="inConversationResults"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <ul>
                    {relevantPage.map(article => {
                        const uniqueID = article.id
                        return (
                            <li key={uniqueID}>
                                <MenuInConversationCard data={article} />
                            </li>
                        )
                    })}
                </ul>
                <div
                    className="menuButtons"
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                    <button onClick={backWardsHandler} disabled={pageNumber === 0}>
                        Page Back
                    </button>
                    <button onClick={forwardsHandler} disabled={pageNumber >= lastPageIndex}>
                        Page Forward
                    </button>
                </div>
            </div>
        )
    }
}

export default MenuInConversationResultsPage
