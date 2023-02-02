import { useState } from 'react';

import { showErrorToast, showSuccessToast } from 'components/Toast';

import { formatCurrency } from 'utils/formatter';

import data from 'data/currency.json';

export default function General({ user }) {
	const [currencyData, setCurrencyData] = useState({ currency: user.currency });

	const onUpdate = async (data) => {
		const { currency } = data;
		try {
			const res = await fetch('/api/user/update', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currency }),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || res.statusText);
			}

			showSuccessToast('Currency is updated!');
			setCurrencyData(data);
		} catch (error) {
			showErrorToast(error.message);
		}
	};

	return (
		<div className="mt-4 flex">
			<label className="block">
				<span className="block text-sm font-normal text-zinc-600">Choose your currency</span>
				<div className="flex flex-col sm:flex-row">
					<select
						name="Currency and Locale"
						className="mt-2 block h-9 w-full max-w-xs appearance-none rounded-md bg-white py-2 px-3 pr-8 text-sm text-black shadow-sm ring-1 ring-gray-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
						onChange={(event) => {
							onUpdate({ currency: event.target.value });
						}}
						value={currencyData.currency}
					>
						{Object.keys(data).map((key) => {
							const { currency } = data[key];
							const [currencyCode] = currency;
							return (
								<option key={`${currencyCode}-${key}`} value={currencyCode}>
									{data[key].name}
								</option>
							);
						})}
					</select>
					<span className="ml-0 mt-3 text-sm sm:mt-4 sm:ml-6">
						Eg:{' '}
						<span className="font-medium text-orange-600">
							{formatCurrency(100, currencyData.currency, currencyData.locale)}
						</span>
					</span>
				</div>
			</label>
		</div>
	);
}
