import { getMicrosoftGraphToken } from "@/app/services/tokenService";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { id } = req.query; // Pega o ID passado na requisição

    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }

    try {
        const accessToken = await getMicrosoftGraphToken(); // Função para obter o token de autenticação

        const response = await fetch(
            `https://graph.microsoft.com/v1.0/sites/685aff9c-79e6-43fb-b9dd-affa07528c81/lists/82008320-2414-4740-a1eb-04e68d021fa2/items?$filter=id eq '${id}'`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error fetching item: ${response.statusText}`);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

