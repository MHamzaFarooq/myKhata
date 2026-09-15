type DayActivity = {
  day: string;
  count: number;
};

const LEVEL_COLORS = [
  "bg-white/5",
  "bg-[#8CFF00]/25",
  "bg-[#8CFF00]/45",
  "bg-[#8CFF00]/70",
  "bg-[#8CFF00]",
];

function getLevel(count: number, max: number) {
  if (count === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

function formatDayLabel(day: string) {
  return new Date(`${day}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function ActivityHeatmap({ data }: { data: DayActivity[] }) {
  const monthLabel = data[0]
    ? new Date(`${data[0].day}T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
      })
    : "";

  // Pad the front so day 1 lands on its real weekday row (Sun-Sat).
  const leadingBlanks = data[0]
    ? new Date(`${data[0].day}T00:00:00`).getDay()
    : 0;

  const cells: (DayActivity | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...data,
  ];

  const columns = Math.ceil(cells.length / 7);
  const max = Math.max(1, ...data.map((d) => d.count));
  const totalEntries = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex h-75 w-full shrink-0 flex-col gap-3 rounded-3xl bg-[#101d27] p-4 lg:w-56">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-white/70">{monthLabel} Activity</h3>
        <span className="text-xs text-white/30">
          {totalEntries} {totalEntries === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 gap-2">
        <div className="grid grid-rows-7 gap-0.75 text-[9px] text-white/30">
          <span />
          <span className="flex items-center">Mon</span>
          <span />
          <span className="flex items-center">Wed</span>
          <span />
          <span className="flex items-center">Fri</span>
          <span />
        </div>

        <div
          className="grid flex-1 gap-0.75"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: "repeat(7, minmax(0, 1fr))",
            gridAutoFlow: "column",
          }}
        >
          {cells.map((cell, index) =>
            cell ? (
              <div
                key={cell.day}
                title={`${formatDayLabel(cell.day)}: ${cell.count} ${
                  cell.count === 1 ? "entry" : "entries"
                }`}
                className={`rounded-[3px] ${LEVEL_COLORS[getLevel(cell.count, max)]}`}
              />
            ) : (
              <div key={`blank-${index}`} />
            ),
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 text-[10px] text-white/30">
        <span>Less</span>
        {LEVEL_COLORS.map((color, level) => (
          <div key={level} className={`h-2.5 w-2.5 rounded-[2px] ${color}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
