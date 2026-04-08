import { useStore } from 'vuex';
import axios from "axios";
import { ref } from "vue";

export const loadPopulationOptions = (url) => {
    const data = ref(null)
    const error = ref(null)
    const response = ref(null)
    const loading = ref(false)
    const store = useStore()

    const fetch = async() => {
        loading.value = true;
        try {

            const result = await axios
                .get(process.env.API_SERVER + "/api/population-datasets-info", {
            params: {
                  
                },
            })
            .then((response) => {
                const body = response.data
                data.value = Array.isArray(body?.records) ? body.records : body
                console.log(data.value)
            })
        } catch (ex) {
            error.value = ex;
        } finally {
            loading.value = false;
            
            return {response, error, data, loading }
        }
    }

    return { fetch }
}
