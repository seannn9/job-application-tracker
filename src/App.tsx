import Navbar from "./components/ui/navbar";
import { useEffect, useState, type FormEventHandler } from "react";
import Table from "./components/ui/table";

interface ApplicationType {
    id: number;
    company: string;
    role: string;
    location: string;
    date: string;
    status: "waiting" | "rejected" | "accepted";
}

export default function App() {
    const [applications, setApplications] = useState<ApplicationType[]>([]);
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [dateApplied, setDateApplied] = useState("");
    const [status, setStatus] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchJobApplications();
    }, []);

    const fetchJobApplications = () => {
        setApplications(JSON.parse(localStorage.getItem("jobs") || "[]"));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        try {
            const existingJobs = localStorage.getItem("jobs");
            const nextId =
                existingJobs && existingJobs.length > 0
                    ? Math.max(
                          ...applications.map(
                              (app_id: { id: number }) => app_id.id
                          )
                      ) + 1
                    : 1;
            const jobsArray = existingJobs ? JSON.parse(existingJobs) : [];
            const application = {
                id: nextId,
                company: company,
                role: role,
                location: location,
                date: dateApplied,
                status: status,
            };
            jobsArray.push(application);
            localStorage.setItem("jobs", JSON.stringify(jobsArray));
            fetchJobApplications();
        } catch (error) {
            console.error("An error occured: ", error);
        } finally {
            setCompany("");
            setRole("");
            setLocation("");
            setDateApplied("");
            setStatus("");
        }
    };

    const updateJobStatus = (
        id: number,
        company: string,
        role: string,
        location: string,
        date: string,
        status: ApplicationType["status"]
    ) => {
        try {
            const existingJobs = localStorage.getItem("jobs");
            const jobsArray = existingJobs ? JSON.parse(existingJobs) : [];
            const updatedJob = {
                id: id,
                company: company,
                role: role,
                location: location,
                date: date,
                status: status,
            };
            const updatedJobsArray = jobsArray.map((job: { id: number }) =>
                job.id === id ? updatedJob : job
            );
            localStorage.setItem("jobs", JSON.stringify(updatedJobsArray));
        } finally {
            fetchJobApplications();
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col gap-8 w-full px-5 lg:px-20 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="max-md:w-full w-1/2 flex flex-col gap-2 sm:self-center"
                >
                    <h1>Input Job Information Here:</h1>
                    <label htmlFor="company" className="sr-only">
                        Company
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        placeholder="Company"
                        className="border-[1px] border-background bg-secondary-background p-1 w-full"
                        value={company.trimStart()}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                    <label htmlFor="role" className="sr-only">
                        Role
                    </label>
                    <input
                        type="text"
                        id="role"
                        name="role"
                        placeholder="Role"
                        className="border-[1px] border-background bg-secondary-background p-1 w-full"
                        value={role.trimStart()}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                    <label htmlFor="location" className="sr-only">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Location"
                        className="border-[1px] border-background bg-secondary-background p-1 w-full"
                        value={location.trimStart()}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <label htmlFor="date" className="sr-only">
                        Date Applied
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="border-[1px] border-background bg-secondary-background p-1 w-full"
                        value={dateApplied}
                        onChange={(e) => setDateApplied(e.target.value)}
                        required
                    />
                    <label htmlFor="status" className="sr-only">
                        Status
                    </label>
                    <select
                        name="status"
                        id="status"
                        className="border-[1px] border-background bg-secondary-background p-1 w-full"
                        defaultValue={""}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Application Status
                        </option>
                        <option value="waiting">Waiting</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button
                        type="submit"
                        className="border-primary bg-primary border-2 p-1 cursor-pointer hover:bg-transparent transition-all text-l mt-2 w-full"
                    >
                        Add Job
                    </button>
                </form>
                <section className="w-full flex flex-col gap-4">
                    <label htmlFor="status-filter" className="sr-only">
                        Status Filter
                    </label>
                    <select
                        name="status-filter"
                        id="status-filter"
                        className="self-end border-[1px] border-background bg-secondary-background p-1"
                        defaultValue={""}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">No Filter</option>
                        <option value="waiting">Waiting</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <Table
                        applications={applications}
                        statusFilter={statusFilter}
                        updateJobStatus={(
                            id,
                            company,
                            role,
                            location,
                            date,
                            status
                        ) => {
                            updateJobStatus(
                                id,
                                company,
                                role,
                                location,
                                date,
                                status
                            );
                        }}
                    />
                    <div className="text-center">
                        <span className="">
                            {statusFilter.charAt(0).toUpperCase() +
                                statusFilter.slice(1)}{" "}
                            Job Applications:{" "}
                        </span>
                        <span className="text-primary font-bold">
                            {
                                applications.filter(
                                    (app) =>
                                        !statusFilter ||
                                        app.status === statusFilter
                                ).length
                            }
                        </span>
                    </div>
                </section>
            </main>
        </div>
    );
}
