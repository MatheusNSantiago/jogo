import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",

});

const Controller = {

    getRanking: async () =>{
        const response = await api.get('/ranking');
        return response;
    },
        
    postRanking: async (ranking: JSON) =>{ 
        const response = await api.post('/ranking',ranking);
        return response;
    },

}

export default Controller;