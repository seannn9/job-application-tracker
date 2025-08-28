import { useState } from "react";

interface TableProps {
    applications: {
        id: number;
        company: string;
        role: string;
        location: string;
        date: string;
        status: "waiting" | "rejected" | "accepted";
    }[];
    statusFilter: string;
    updateJobStatus: (
        id: number,
        company: string,
        role: string,
        location: string,
        date: string,
        status: "waiting" | "rejected" | "accepted"
    ) => void;
}

interface StatusType {
    status: "waiting" | "rejected" | "accepted";
}

export default function Table({
    applications,
    statusFilter,
    updateJobStatus,
}: TableProps) {
    const [updatedStatus, setUpdatedStatus] = useState<{
        [id: number]: StatusType["status"];
    }>({});

    const update = (
        id: number,
        company: string,
        role: string,
        location: string,
        date: string,
        status: "waiting" | "rejected" | "accepted"
    ) => {
        updateJobStatus(id, company, role, location, date, status);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-2 border-secondary-background">
                <thead className="bg-secondary-background border-b-2 border-secondary-background">
                    <tr className="text-lg">
                        <th>Company</th>
                        <th>Role</th>
                        <th>Location</th>
                        <th>Date Applied</th>
                        <th>Status</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length > 0 ? (
                        applications
                            .filter(
                                (app) =>
                                    statusFilter === "" ||
                                    app.status === statusFilter
                            )
                            .map((application) => (
                                <tr
                                    key={application.id}
                                    className="border-b-[1px] border-secondary-background"
                                >
                                    <td>{application.company}</td>
                                    <td>{application.role}</td>
                                    <td>{application.location || "N/A"}</td>
                                    <td>
                                        {application.date &&
                                            new Date(application.date)
                                                .toDateString()
                                                .slice(4)}
                                    </td>
                                    <td
                                        className={
                                            application.status === "rejected"
                                                ? `text-rejected`
                                                : application.status ===
                                                  "accepted"
                                                ? "text-accepted"
                                                : "text-yellow-400"
                                        }
                                    >
                                        <select
                                            name="jobstatus"
                                            id="jobstatus"
                                            defaultValue={application.status}
                                            className="bg-secondary-background p-1"
                                            value={
                                                updatedStatus[application.id] ||
                                                application.status
                                            }
                                            onChange={(e) =>
                                                setUpdatedStatus((prev) => ({
                                                    ...prev,
                                                    [application.id]: e.target
                                                        .value as StatusType["status"],
                                                }))
                                            }
                                        >
                                            <option
                                                className="text-foreground"
                                                value="waiting"
                                            >
                                                Waiting
                                            </option>
                                            <option
                                                className="text-foreground"
                                                value="accepted"
                                            >
                                                Accepted
                                            </option>
                                            <option
                                                className="text-foreground"
                                                value="rejected"
                                            >
                                                Rejected
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className={`border-[1px] p-1 transition-all ${
                                                (updatedStatus[
                                                    application.id
                                                ] || application.status) ===
                                                application.status
                                                    ? "bg-secondary-background border-secondary-background cursor-not-allowed text-gray-400"
                                                    : "bg-primary border-primary hover:bg-transparent cursor-pointer"
                                            }`}
                                            disabled={
                                                (updatedStatus[
                                                    application.id
                                                ] || application.status) ===
                                                application.status
                                            }
                                            onClick={() => {
                                                update(
                                                    application.id,
                                                    application.company,
                                                    application.role,
                                                    application.location,
                                                    application.date,
                                                    updatedStatus[
                                                        application.id
                                                    ] || application.status
                                                );
                                            }}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                    ) : (
                        <tr className="w-full text-center italic">
                            <td colSpan={6}>Start Applying...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
