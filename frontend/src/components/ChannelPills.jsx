import Pill from './Pill';
import { BOOKING_CHANNELS } from '../data/appointments';

export default function ChannelPills() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {BOOKING_CHANNELS.map((channel) => (
        <Pill key={channel} tone="neutral">{channel}</Pill>
      ))}
    </div>
  );
}