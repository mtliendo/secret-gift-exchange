import { withAuthenticator } from '@aws-amplify/ui-react'
import { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import './App.css'

function App() {
	const [giftBudget, setGiftBudget] = useState('50') //hardcoded for now.
	const [phoneNumberData, setPhoneNumbers] = useState([])

	useEffect(() => {
		async function fetchVerifiedNumbers() {
			const phoneData = [
				{ phoneNumber: '+5555555555', alias: '' },
				{ phoneNumber: '+14444444444', alias: '' },
				{ phoneNumber: '+13333333333', alias: '' },
			]
			setPhoneNumbers(phoneData)
			const numbers = await API.get('secretgift', '/list-sandbox-users')
			console.log(numbers)
		}

		fetchVerifiedNumbers()
	}, [])

	const handleAliasChange = (value, index) => {
		const updatedPhoneData = phoneNumberData.map(
			(phoneNumberItem, currIndex) => {
				return currIndex === index
					? { ...phoneNumberItem, alias: value }
					: phoneNumberItem
			}
		)
		setPhoneNumbers(updatedPhoneData)
	}

	const handleMessagePublishClick = async () => {
		await API.post('secretgift', '/publish-messages', {
			body: {
				phoneNumberData,
				giftBudget,
			},
		})
	}
	return (
		<div className="App">
			<h1>Secret SMS Exchange</h1>
			<p>Budget Amount: ${giftBudget}</p>
			<main>
				<table>
					<thead>
						<th>Verified Phone Number</th>
						<th>Alias</th>
					</thead>
					<tbody>
						{phoneNumberData.map((phoneDataItem, index) => (
							<tr>
								<td>{phoneDataItem.phoneNumber}</td>
								<td>
									<input
										placeholder="alias"
										value={phoneDataItem.alias}
										onChange={(e) => handleAliasChange(e.target.value, index)}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</main>
			<button onClick={handleMessagePublishClick}>Shuffle and Send!</button>
		</div>
	)
}

export default withAuthenticator(App)
