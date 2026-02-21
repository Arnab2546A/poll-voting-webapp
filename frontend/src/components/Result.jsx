export default function Result({ hasVoted, results, userVotedOptionId }) {
	const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

	return (
		<div className="mb-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="text-xl font-bold text-gray-800">Results</h3>
				<span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
					{totalVotes} {totalVotes === 1 ? "vote" : "votes"}
				</span>
			</div>

			{hasVoted && (
				<p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
					✓ You have already submitted this poll.
				</p>
			)}

			<div className="space-y-4">
				{results.map((result) => (
				<div key={result.id} className={`rounded-xl border p-4 ${
					userVotedOptionId === result.id
						? "border-green-300 bg-green-50"
						: "border-gray-100 bg-white"
				}`}>
					<div className="mb-2 flex items-center justify-between gap-4">
						<div className="flex items-center gap-2">
							{userVotedOptionId === result.id && (
								<span className="text-green-600 font-bold text-lg">✓</span>
							)}
							<p className="text-base font-semibold text-gray-800">{result.option_text}</p>
						</div>
							<p className="text-sm font-medium text-gray-600">
								{result.count} {result.count === 1 ? "vote" : "votes"}
							</p>
						</div>
						<div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
							<div
								className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
								style={{ width: `${totalVotes > 0 ? (result.count / totalVotes) * 100 : 0}%` }}
							/>
						</div>
						<p className="mt-2 text-right text-xs font-medium text-gray-500">
							{totalVotes > 0 ? ((result.count / totalVotes) * 100).toFixed(1) : "0.0"}%
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
