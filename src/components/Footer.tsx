import React from "react";

const Footer = () => {
	return (
		<div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-50">
			<button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100">
				Cancel
			</button>
			<button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
				Next step &gt;
			</button>
		</div>
	);
};

export default Footer;
