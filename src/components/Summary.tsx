interface SummaryProps {
	verdict: string;
	message: string;
}

const Summary = ({ verdict, message }: SummaryProps) => {
	let styles =
		"bg-white rounded-sm mb-1 mr-5 p-3 summaryOverride shadowOverride flex";
	switch (verdict) {
		case "SAFE":
			styles += " summarySafe";
			break;
		case "WARNING":
			styles += " summaryWarning";
			break;
		default:
			styles += " summaryUnsafe";
	}

	return (
		<div className={styles}>
			<div>PhishAlert Safety Summary: {verdict}</div>
			<div className="flex-1"></div>
			<div>{message}</div>
		</div>
	);
};

export default Summary;
