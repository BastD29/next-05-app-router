import { notFound } from "next/navigation";
import { Ticket } from "../TicketsList";

// controls what happens when a dynamic segment is visited that was not generated with generateStaticParams.
export const dynamicParams = true; // default val = true

// runs at build time and uses the returned list of ids to generate the static pages
// we use generateStaticParams so we can render page detail based on static rendering principles
export async function generateStaticParams() {
  const res = await fetch("http://localhost:4000/tickets");

  const tickets = await res.json();

  return tickets.map((ticket: Ticket) => ({
    id: ticket.id,
  }));
}

async function getTicket(id: string) {
  // just here to test loading skeleton
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const res = await fetch(`http://localhost:4000/tickets/${id}`, {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

// type Params = {
//   id: string;
// };

// type TicketDetailsProps = {
//   params: Params;
// };

// export default async function TicketDetails({ params }: TicketDetailsProps) {
export default async function TicketDetails({
  params,
}: {
  params: { id: string };
}) {
  const ticket = await getTicket(params.id);

  return (
    <main>
      <nav>
        <h2>Ticket Details</h2>
      </nav>
      <div className="card">
        <h3>{ticket.title}</h3>
        <small>Created by {ticket.user_email}</small>
        <p>{ticket.body}</p>
        <div className={`pill ${ticket.priority}`}>
          {ticket.priority} priority
        </div>
      </div>
    </main>
  );
}
