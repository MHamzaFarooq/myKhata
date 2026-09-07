import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
} from "@react-email/components";

type MonthlyReportEmailProps = {
  username: string;
  monthLabel: string; // e.g. "September 2026"
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export default function MonthlyReportEmail({
  username,
  monthLabel,
  totalIncome,
  totalExpense,
  balance,
}: MonthlyReportEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#141617", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#101d27",
            borderRadius: "24px",
            padding: "32px",
            color: "#ffffff",
          }}
        >
          <Heading style={{ fontWeight: 400, fontSize: "24px" }}>
            Hey {username}, here's your {monthLabel} summary
          </Heading>

          <Section style={{ marginTop: "24px" }}>
            <Text style={{ color: "#96FF04", fontSize: "16px" }}>
              Income: PKR {totalIncome.toLocaleString()}
            </Text>
            <Text style={{ color: "#FF6063", fontSize: "16px" }}>
              Expense: PKR {totalExpense.toLocaleString()}
            </Text>
            <Text style={{ fontSize: "18px", fontWeight: 600 }}>
              Balance: PKR {balance.toLocaleString()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
