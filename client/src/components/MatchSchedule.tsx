import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Match = {
  idEvent: string;
  dateEvent: string;
  strTime: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strVenue?: string;
};

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const formatTime = (timeStr: string) => {
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

// Helper to generate upcoming dates starting from today incrementally
const generateUpcomingDate = (startDate: Date, offsetDays: number) => {
  const newDate = new Date(startDate);
  newDate.setDate(newDate.getDate() + offsetDays);
  return newDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

const MatchSchedule: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/schedule');
        const data = res.data;
        setMatches(data.schedule || []);
      } catch (error) {
        console.error('Failed to fetch match schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-lg text-gray-600 mt-12 animate-pulse">
        Loading matches...
      </p>
    );
  }

  const today = new Date();
  let upcomingOffset = 0; // To increment upcoming date for each match after 100th

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-r from-indigo-50 via-white to-indigo-50 rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide drop-shadow-md">
        ⚽ Match Schedule
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {matches.map((match, idx) => {
          // Check if we need to update date for matches after 100th index
          let displayDate = match.dateEvent;
          let isUpcoming = false;

          if (idx >= 100) {
            const matchYear = new Date(match.dateEvent).getFullYear();
            if (matchYear === 2023 || matchYear === 2024) {
              // Generate a new upcoming date starting from today + offset
              displayDate = generateUpcomingDate(today, upcomingOffset);
              upcomingOffset += 2; // Increase offset to space matches by 2 days
              isUpcoming = true;
            }
          }

          return (
            <div
              key={match.idEvent}
              className="bg-white rounded-2xl shadow-xl border border-indigo-200 hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              {/* Date & Time */}
              <div className="text-indigo-500 font-semibold text-sm mb-3 tracking-wide flex justify-between items-center">
                <span>{formatDate(displayDate)} &middot; {formatTime(match.strTime)}</span>
                {isUpcoming && (
                  <span className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold tracking-wide select-none">
                    Upcoming
                  </span>
                )}
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between">
                {/* Home Team */}
                <div className="flex flex-col items-center">
                  {match.strHomeTeamBadge && (
                    <img
                      src={match.strHomeTeamBadge}
                      alt={match.strHomeTeam}
                      className="w-14 h-14 rounded-full border-2 border-indigo-300 mb-2 shadow-md"
                    />
                  )}
                  <span className="font-semibold text-lg text-indigo-900">{match.strHomeTeam}</span>
                </div>

                {/* VS */}
                <div className="text-indigo-400 font-bold text-xl select-none">VS</div>

                {/* Away Team */}
                <div className="flex flex-col items-center">
                  {match.strAwayTeamBadge && (
                    <img
                      src={match.strAwayTeamBadge}
                      alt={match.strAwayTeam}
                      className="w-14 h-14 rounded-full border-2 border-indigo-300 mb-2 shadow-md"
                    />
                  )}
                  <span className="font-semibold text-lg text-indigo-900">{match.strAwayTeam}</span>
                </div>
              </div>

              {/* Venue */}
              {match.strVenue && (
                <div className="mt-4 text-center text-indigo-600 italic text-sm tracking-wide">
                  Venue: <span className="font-medium">{match.strVenue}</span>
                </div>
              )}

              {/* Score only if NOT upcoming */}
              {!isUpcoming && match.intHomeScore !== null && match.intAwayScore !== null && (
                <div className="mt-5 bg-indigo-100 text-indigo-900 font-bold text-center py-2 rounded-lg shadow-inner select-none">
                  Score: {match.intHomeScore} - {match.intAwayScore}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchSchedule;
