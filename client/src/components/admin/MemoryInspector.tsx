import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw } from "lucide-react";

interface MemoryRecord {
  content: string;
  timestamp: string;
  metadata: Record<string, any>;
}

interface MemoryResponse {
  userEmail: string;
  stats: { total: number; recent: number };
  recentMemories: MemoryRecord[];
}

export function MemoryInspector() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { data, isFetching, refetch, isError } = useQuery<MemoryResponse | null>({
    queryKey: ["memories", submittedEmail],
    enabled: !!submittedEmail,
    queryFn: async () => {
      const params = new URLSearchParams({ userEmail: submittedEmail || "" });
      const res = await fetch(`/api/chat/memory/user?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user memories");
      }
      return res.json();
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmittedEmail(email.trim());
    refetch();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
        <Input
          type="email"
          placeholder="Enter user email to inspect..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!email.trim() || isFetching}>
          {isFetching ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Inspect Memory
            </>
          )}
        </Button>
      </form>

      {isError && (
        <p className="text-sm text-red-600">
          Failed to load memories. Please check the email and try again.
        </p>
      )}

      {data && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Summary</CardTitle>
              <CardDescription>User: {data.userEmail}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Memories</p>
                <p className="text-2xl font-semibold">{data.stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Recent (30 days)</p>
                <p className="text-2xl font-semibold">{data.stats.recent}</p>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentMemories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                      No memories found for this user yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.recentMemories.map((m, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="whitespace-nowrap text-sm text-gray-500">
                        {new Date(m.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">
                          {(m.metadata?.type as string) || "unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xl">
                        <p className="text-sm text-gray-900 line-clamp-3">
                          {m.content}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

