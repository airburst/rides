import { env } from "@/env";
import { loadMembers } from "@/server/actions/load-members";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { convertMembers } from "./convertMembers";
import { type Member, type MemberData } from "./types";

const { RIDERHQ_URL, RIDERHQ_ACCOUNT_ID, RIDERHQ_PRIVATE_KEY } = env;
const Authorization = `Basic ${Buffer.from(
  `${RIDERHQ_ACCOUNT_ID}:${RIDERHQ_PRIVATE_KEY}`,
  "utf8",
).toString("base64")}`;

type MembersResponse = {
  data: MemberData[];
  has_more_bool: boolean;
};

const fetchMembers = (startAfter?: string): Promise<MembersResponse> => {
  let query = `${RIDERHQ_URL}/api/v2/groups/grp_2ohch80/members?sort=lastname_txt,firstnames_txt`;

  if (startAfter) {
    query += `&starting_after_id=${startAfter}`;
  }

  return fetch(query, {
    headers: {
      Authorization,
    },
  }).then((data) => data.json() as unknown as MembersResponse);
};

const fetchAllMembers = async (
  members?: Member[],
  startAfter?: string,
): Promise<Member[]> => {
  const results: MembersResponse = await fetchMembers(startAfter);
  // Add to collection
  const allMembers = [...(members ?? []), ...convertMembers(results.data)];
  // Paginate recursively
  if (results.has_more_bool) {
    const lastMemberId = results.data[results.data.length - 1]?.id;
    return fetchAllMembers(allMembers, lastMemberId);
  }
  return allMembers;
};

export async function POST() {
  const headersList = headers();
  const authorization = headersList.get("authorization");

  if (authorization === `Bearer ${process.env.API_KEY}`) {
    const members: Member[] = await fetchAllMembers();

    // Write members data to table (having truncated first)
    if (members.length > 0) {
      // Truncate table
      await loadMembers(members);
    }

    return NextResponse.json(
      {
        success: true,
        count: members.length,
      },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
}
