import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/" });

export namespace API {
  export async function getRankings() {
    const response = await api.get("/ranking");

    return response.data.map(({ nickname, record }: any) => {
      return {
        nickname,
        score: record.gold + record.hp - record.torresUsadas,
      };
    });
  }

  export async function postRanking({
    nickname,
    torresUsadas,
    gold,
    hp,
  }: {
    nickname: string;
    torresUsadas: number;
    gold: number;
    hp: number;
  }) {
    const response = await api.post("/ranking", {
      nickname: nickname,
      record: { torresUsadas: torresUsadas, gold: gold, hp: hp },
    });
    return response;
  }
}
