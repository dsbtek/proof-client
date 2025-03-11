"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./DatePicker.module.css";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import DatePickerBtn from "../date-picker-btn";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

interface Callendar {
  title: string;
  date?: string;
  onDateSelect: (date: string) => void;
}

const DatePicker = ({ title, date, onDateSelect }: Callendar) => {
  // Helper function to format day with leading zero
  const formatDay = (day: number) => {
    return day < 10 ? `0${day}` : `${day}`;
  };

  // Helper function to format month with leading zero
  const formatMonth = (month: number) => {
    return month < 10 ? `0${month}` : `${month}`;
  };

  // Helper function to format date in DD-MM-YYYY format
  function formatDate(date: Date): string {
    const day = formatDay(date.getDate());
    const month = formatMonth(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  ); // 0-based month index
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date())
  );

  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);

  const datePickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedDay]);

  useEffect(() => {
    monthRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedMonth]);

  useEffect(() => {
    yearRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedYear]);

  useEffect(() => {
    const formattedDate = `${formatDay(selectedDay)}-${formatMonth(
      selectedMonth + 1
    )}-${selectedYear}`;
    setSelectedDate(formattedDate);
    onDateSelect(formattedDate);
  }, [selectedDay, selectedMonth, selectedYear, onDateSelect]);

  const toggleCallendarView = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setIsDatePickerVisible(false);
    }
  };

  useEffect(() => {
    if (isDatePickerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerVisible]);

  return (
    <div className="date-picker-container" style={{ position: "relative" }}>
      <DatePickerBtn
        ref={buttonRef}
        onClick={toggleCallendarView}
        classname="select-w"
      >
        <span>
          {title}: {selectedDate}
        </span>
        {isDatePickerVisible ? (
          <FiChevronUp size={20} />
        ) : (
          <FiChevronDown size={20} />
        )}
      </DatePickerBtn>
      <br />
      {isDatePickerVisible && (
        <div ref={datePickerRef} className={styles.datePicker}>
          <div className={styles.column}>
            <div className={styles.borderTop}></div>
            {days.map((day) => (
              <div
                key={day}
                ref={day === selectedDay ? dayRef : null}
                className={`${styles.item} ${
                  day === selectedDay ? styles.selected : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </div>
            ))}
            <div className={styles.borderBottom}></div>
          </div>
          <div className={styles.column}>
            <div className={styles.borderTop}></div>
            {months.map((month, index) => (
              <div
                key={month}
                ref={index === selectedMonth ? monthRef : null}
                className={`${styles.item} ${
                  index === selectedMonth ? styles.selected : ""
                }`}
                onClick={() => setSelectedMonth(index)}
              >
                {month}
              </div>
            ))}
            <div className={styles.borderBottom}></div>
          </div>
          <div className={styles.column}>
            <div className={styles.borderTop}></div>
            {years.map((year) => (
              <div
                key={year}
                ref={year === selectedYear ? yearRef : null}
                className={`${styles.item} ${
                  year === selectedYear ? styles.selected : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </div>
            ))}
            <div className={styles.borderBottom}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
