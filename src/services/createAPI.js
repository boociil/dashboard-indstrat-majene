
// reqAPI.js

export function createApi(baseURL) {
    return async function request(endpoint, options = {}) {
        const res = await fetch(`${baseURL}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...options.headers, // override jika diperlukan
            },
        });

        if (!res.ok) {
            throw new Error("Request gagal");
        }

        return res.json();
    };
}


// cara pakai : 

// // services/bpsApi.js

// import { apiFetch } from "./apiClient";

// export async function getPdrb() {
//     return apiFetch("/pdrb");
// }

// export async function getKemiskinan() {
//     return apiFetch("/kemiskinan");
// }

// export async function getInflasi() {
//     return apiFetch("/inflasi");
// }