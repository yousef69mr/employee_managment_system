import { Suspense, lazy, useEffect } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import Navbar from "@/components/navigation/navbar";
import Loading from "@/components/loading";
import ScrollToTopButton from "@/components/helpers/scroll-to-top-button";
import ToasterProvider from "@/components/providers/toaster-provider";

const HomePage = lazy(() => import("@/components/pages/home"));
const EmployeesPage = lazy(() => import("@/components/pages/employees"));
const SingleEmployeePage = lazy(
  () => import("@/components/pages/single-employee")
);
const SearchEmployeesPage = lazy(
  () => import("@/components/pages/search-employees")
);

function App() {
  return (
    <Suspense fallback={<Loading className=" h-screen" />}>
      <ScrollToTopButton />
      <Navbar />

      <main>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees" element={<EmployeesPage />}>
              <Route path="search" element={<SearchEmployeesPage />} />
            </Route>
            <Route
              path="/employees/:employeeId"
              element={<SingleEmployeePage />}
            />
          </Routes>
        </Router>
        <ToasterProvider />
      </main>
    </Suspense>
  );
}

export default App;
