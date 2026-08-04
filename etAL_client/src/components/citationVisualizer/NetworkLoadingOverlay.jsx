function NetworkLoadingOverlay() {
    return (
        <div className="networkLoadingOverlay" role="status" aria-live="polite">
            <div className="networkLoadingMessage">Loading your graph, please wait!</div>
        </div>
    )
}

export default NetworkLoadingOverlay
