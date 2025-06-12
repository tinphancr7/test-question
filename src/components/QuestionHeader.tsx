// components/QuestionHeader.tsx
import React from "react";

interface QuestionHeaderProps {
	searchPlaceholder?: string;
	onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onGetMoreClick?: () => void;
	onAddAllClick?: () => void;
	showAddAll?: boolean;
}

export default function QuestionHeader({
	searchPlaceholder = "Search",
	onSearchChange,
	onGetMoreClick,
	onAddAllClick,
	showAddAll = false,
}: QuestionHeaderProps) {
	return (
		<div className="flex items-center justify-between py-3 ">
			<div className="relative w-[300px]">
				<input
					type="text"
					placeholder={searchPlaceholder}
					onChange={onSearchChange}
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
				/>
				<svg
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					></path>
				</svg>
			</div>

			<div className="flex gap-2">
				<button
					onClick={onGetMoreClick}
					className="px-6 py-2 bg-transparent border-[#D48806] rounded-lg border text-[#D48806] transition-colors duration-200"
				>
					Get more question
				</button>

				{showAddAll && (
					<button
						onClick={onAddAllClick}
						className="py-2 px-4 bg-[#FAAD14] text-white rounded-lg transition-colors duration-200"
					>
						Add all
					</button>
				)}
			</div>
		</div>
	);
}
