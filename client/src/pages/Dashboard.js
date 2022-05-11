import { useEffect } from 'react';

const Dashboard = () => {
  const fetchData = async () => {
    try {
      // ovo ce da bude tretirano kao fallback, pogledacemo na nas server ako ne postoji to sto trazimo on ce onda pogledati na nas local development
      // const response = await fetch('/');
      const response = await fetch('/api/v1');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <h1>Dashboard</h1>;
};

export default Dashboard;
