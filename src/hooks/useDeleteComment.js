import { useState } from 'react'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

const useDeleteComment = (id) => {
	const [error, setError] = useState(null)
	const [isError, setIsError] = useState(null)
	const [isMutating, setIsMutating] = useState(null)

	const mutate = async () => {
		// reset internal state
		setError(null)
		setIsError(false)
		setIsMutating(true)

		try {
			await deleteDoc(doc(db, 'comments', id))

		} catch (e) {
			setError(e.message)
			setIsError(true)

		} finally {
			setIsMutating(false)
		}
	}

	return {
		error,
		isError,
		isMutating,
		mutate,
	}
}

export default useDeleteComment