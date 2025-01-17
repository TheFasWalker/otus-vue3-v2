import { SiteState } from "../../store/SiteState"
import { UserSate } from "../../store/UserState"
const url = import.meta.env.VITE_API_DB_URL


export default function () {
    const siteState = SiteState()
    const userState = UserSate()

    const getUserData = async (id: string) => {
        siteState.loadingTrue()
        siteState.cleanTextError()
        const headersData = {
            'Content-Type': 'application/json',
        }
        if (userState.getUserToken) {
            headersData['Authorization'] = `Bearer ${userState.userToken}`
        }
        return fetch (url + `/admin_profile?id=${id}` ,{
            method: 'GET',
            headers: headersData,
        })
        .then(async (res) => {
            if (!res.ok) {
                const errorMessage = await res.text
                const errorText = `HTTP error! status: ${res.status}, message: ${errorMessage}`
                siteState.errorText = errorText
                throw new Error(errorText);
            }
            return res.json();
        })
        .catch((err) => {
            siteState.errorText = err.text
            throw err
        })
            .finally(() => {
                siteState.loadingFalse()
        })
    }
    return {
        getUserData
    }
}