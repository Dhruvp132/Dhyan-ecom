"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAllUsersQuery } from "@/providers/toolkit/features/GetAllUserSlice";
import TableSkeletons from "../temp/TableSkeletons";
import { format } from "date-fns";

const Usertable = () => {
  const { data, error, isLoading } = useGetAllUsersQuery();

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <TableSkeletons />
      </div>
    );
  if (error) return <div>An error occurred: {error.toString()}</div>;
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Users</CardTitle>
        <CardDescription>List of users and their roles.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-xs font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="secondary">
                      {user.isAdmin ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "PPP")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.updatedAt), "PPP")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Usertable;
