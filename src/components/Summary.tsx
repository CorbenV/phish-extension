interface SummaryProps {
	verdict: string;
	message: string;
}

const Summary = ({ verdict, message }: SummaryProps) => {
	return (
		<div className="bg-white rounded-sm mb-1 mr-5 p-3 summaryOverride shadowOverride flex">
			<div>PhishAlert Safety Summary: {verdict}</div>
			<div className="flex-1"></div>
			<div>{message}</div>
		</div>
	);
};

export default Summary;
