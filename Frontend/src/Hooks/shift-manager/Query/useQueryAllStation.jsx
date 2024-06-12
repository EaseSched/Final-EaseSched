
import React from 'react'
import useStations from '../store/useStations'
import { useQuery } from '@tanstack/react-query'

export default function useQueryAllStation() {
    const setStations = useStations((state) => state.setStations)
    const stations = useStations((state) => state.stations)
    const {
        data,
        isLoading,
        isError,
        refetch,
     } = useQuery({
        queryKey: [124567, 'stations'],
        queryFn: async () => {
            const token = localStorage.getItem('token')
            try {
    
                const response = await fetch(`http://localhost:3000/station/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`
                    }
                })
                // if (!response.ok) {
                //     localStorage.clear()
                //     return null
                // }
                const data = await response.json().then(e => {
                    setStations(e)
                })
                console.log("stations: ", stations);
                return data
            } catch (error) {
                console.error('Error fetching station data:', error)
                // if (error.response.status === 403) {
                //     // localStorage.clear()
                //     return null
                // }
                // if (error.message === '') {
                //     return null
                // }
            }
        }
    })
  return {
    stationData: data,
    stationIsLoading: isLoading,
    stationIsError: isError,
    stationRefetch: refetch,
  }
}
