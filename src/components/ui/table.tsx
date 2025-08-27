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
}

export default function Table({ applications, statusFilter }: TableProps) {
    const [isEditing, setIsEditing] = useState(false);

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
                                        {!isEditing
                                            ? application.status
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              application.status.slice(1)
                                            : "Editing"}
                                    </td>
                                    <td>
                                        <button
                                            className="bg-primary border-primary border-[1px] p-1 cursor-pointer hover:bg-transparent transition-all"
                                            onClick={() => {
                                                setIsEditing(!isEditing);
                                                console.log(
                                                    isEditing,
                                                    application.id
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
