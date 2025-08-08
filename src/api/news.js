import axios from 'axios';

export async function fetchTop3Keywords() {
  const token = localStorage.getItem("accessToken");

  const res = await axios.get("http://localhost:8000/api/keywords/", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      sort: "popular",
      page: 1,
      page_size: 3,
    },
  });

  return res.data.data || res.data.results || [];
}