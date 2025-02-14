"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAllItems, createItem, updateItem, deleteItem } from "./services/apiService";
import Modal from "./components/Modal";
import Dropdown from "./components/Dropdown";
import SearchField from "./components/Search";
import Chart from "chart.js/auto";
import Dashboard from "./components/Dasjboard";

const Home = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  return (
      <Dashboard></Dashboard>
  );
};

export default Home;
