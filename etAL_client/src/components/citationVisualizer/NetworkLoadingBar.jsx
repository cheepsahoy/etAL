function NetworkLoadingBar({ loadingData }) {
  const estimatedLoadingTime = (loadingData / 200) * 1.5;
  return (
    <div className="loadingBar">
      <div></div>
    </div>
  );
}

export default NetworkLoadingBar;
