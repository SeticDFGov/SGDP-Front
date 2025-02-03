import axios from "axios";

export async function POST(req) {
  const url = `https://login.microsoftonline.com/${process.env.YOUR_TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", process.env.AZURE_CLIENT_ID);
  params.append("client_secret", process.env.AZURE_CLIENT_SECRET);
  params.append("scope", "https://graph.microsoft.com/.default");

  try {
    const { data } = await axios.post(url, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return Response.json({ token: data.access_token });
  } catch (error) {
    return Response.json({ error: error.response?.data || error.message }, { status: 500 });
  }
}
