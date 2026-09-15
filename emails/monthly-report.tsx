import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

type MonthlyReportEmailProps = {
  username: string;
  monthLabel: string; // e.g. "September 2026"
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

function formatAmount(value: number) {
  return `PKR ${value.toLocaleString()}`;
}

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
      <Preview>
        Your {monthLabel} summary: {formatAmount(totalIncome)} in,{" "}
        {formatAmount(totalExpense)} out.
      </Preview>
      <Body
        style={{
          backgroundColor: "#141617",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#18252E",
            borderRadius: "28px",
            overflow: "hidden",
            maxWidth: "480px",
          }}
        >
          <Section style={{ backgroundColor: "#101d27", padding: "24px 32px" }}>
            <Row>
              <Column>
                <table role="presentation" cellPadding={0} cellSpacing={0}>
                  <tr>
                    <td
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "9px",
                        backgroundColor: "#8CFF00",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#101d27",
                      }}
                    >
                      M
                    </td>
                    <td
                      style={{
                        paddingLeft: "10px",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#ffffff",
                      }}
                    >
                      MyKhata
                    </td>
                  </tr>
                </table>
              </Column>
              <Column align="right">
                <Text
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Monthly Report
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  {monthLabel}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ padding: "28px 32px 8px" }}>
            <Heading
              style={{
                fontWeight: 400,
                fontSize: "20px",
                color: "#ffffff",
                margin: "0 0 6px",
              }}
            >
              Hey {username}, here&apos;s your {monthLabel} summary
            </Heading>
            <Text
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              The full breakdown, including every transaction and a
              category-by-category view, is in the attached PDF.
            </Text>
          </Section>

          <Section style={{ padding: "16px 32px 8px" }}>
            <Row>
              <Column
                style={{
                  backgroundColor: "rgba(150, 255, 4, 0.08)",
                  borderRadius: "16px",
                  padding: "14px 16px",
                }}
              >
                <Text
                  style={{
                    margin: "0 0 4px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Income
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#96FF04",
                  }}
                >
                  {formatAmount(totalIncome)}
                </Text>
              </Column>
              <Column style={{ width: "8px" }} />
              <Column
                style={{
                  backgroundColor: "rgba(255, 96, 99, 0.08)",
                  borderRadius: "16px",
                  padding: "14px 16px",
                }}
              >
                <Text
                  style={{
                    margin: "0 0 4px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Expense
                </Text>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#FF6063",
                  }}
                >
                  {formatAmount(totalExpense)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Section style={{ padding: "8px 32px 28px" }}>
            <Row
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: "16px",
                padding: "14px 16px",
              }}
            >
              <Column>
                <Text
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Remaining balance
                </Text>
              </Column>
              <Column align="right">
                <Text
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: balance >= 0 ? "#ffffff" : "#FF6063",
                  }}
                >
                  {formatAmount(balance)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: "rgba(255,255,255,0.06)", margin: 0 }} />

          <Section style={{ padding: "20px 32px" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
              }}
            >
              You&apos;re receiving this because monthly reports are turned on
              in your MyKhata account. You can turn them off anytime from your
              profile menu.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
