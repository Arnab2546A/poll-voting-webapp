export default function Result({ hasVoted, results, userVotedOptionId }) {
	const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

	return (
		<div className="glass-surface surface-3d rounded-2xl p-6 sm:p-10">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Live Results</h2>
					<div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 border border-blue-300">
						<span className="text-2xl">🗳️</span>
						<span className="font-bold text-blue-900 text-sm sm:text-base">
							{totalVotes} {totalVotes === 1 ? "vote" : "votes"}
						</span>
					</div>
				</div>
				{hasVoted && (
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold text-sm">
						<span>✓</span>
						<span>You've voted in this poll</span>
					</div>
				)}
			</div>

			{/* Results List */}
			<div className="space-y-5">
				{results.map((result, idx) => {
					const percentage = totalVotes > 0 ? (result.count / totalVotes) * 100 : 0;
					const isUserVote = userVotedOptionId === result.id;

					return (
						<div
							key={result.id}
							className={`rounded-2xl p-4 sm:p-5 border-2 transition-all duration-300 animate-float-in ${
								isUserVote
									? "border-emerald-300 bg-emerald-50 shadow-md"
									: "border-slate-200 bg-slate-50"
							}`}
							style={{ animationDelay: `${idx * 0.05}s` }}
						>
							{/* Option Header */}
							<div className="flex items-start justify-between gap-4 mb-3">
								<div className="flex items-center gap-3 flex-1 min-w-0">
									{isUserVote && (
										<span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
									)}
									<p className="text-base sm:text-lg font-bold text-slate-950 break-words">
										{result.option_text}
									</p>
								</div>
								<div className="flex flex-col items-end gap-1 flex-shrink-0">
									<p className="text-sm sm:text-base font-bold text-blue-600">
										{result.count}
									</p>
									<p className="text-xs text-slate-600">
										{result.count === 1 ? "vote" : "votes"}
									</p>
								</div>
							</div>

							{/* Animated Progress Bar */}
							<div className="relative">
								<div className="h-3 sm:h-4 w-full overflow-hidden rounded-full bg-slate-200">
									<div
										className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 progress-bar-animate"
										style={{
											width: `${percentage}%`,
											animationDelay: `${idx * 0.1}s`
										}}
									/>
								</div>
								<p className="text-right text-xs sm:text-sm font-bold text-slate-700 mt-2">
									{percentage.toFixed(1)}%
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Footer Info */}
			<div className="mt-8 pt-6 border-t border-slate-200">
				<p className="text-xs sm:text-sm text-slate-600 text-center">
					🌍 Worldwide participation • Real-time results
				</p>
			</div>
		</div>
	);
}
