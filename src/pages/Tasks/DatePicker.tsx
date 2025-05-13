import { Box, Dropdown, Menu, MenuButton } from "@mui/joy";
import * as React from "react";
import { DayPicker } from "react-day-picker";

export function DatePickerDemo({
  value,
  onChange,
}: {
  value: Date;
  onChange: React.Dispatch<React.SetStateAction<Date>>;
}) {
  return (
    <Dropdown>
      <MenuButton>Dashboard...</MenuButton>
      <Menu>
        <Box sx={{ px: 2 }}>
          <DayPicker
            animate
            mode="single"
            selected={value}
            required
            onSelect={onChange}
            styles={{
              caption: { color: "blue" },
              day_selected: { backgroundColor: "red", color: "white" },
              day_today: { fontWeight: "bold", color: "green" },
            }}
          />
        </Box>
      </Menu>
    </Dropdown>
  );
}
