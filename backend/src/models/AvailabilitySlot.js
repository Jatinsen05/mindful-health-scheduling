import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Doctor } from './Doctor.js';

const AvailabilitySlot = sequelize.define('AvailabilitySlot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Doctor, key: 'id' }
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'availability_slots',
  timestamps: false
});

// Associations
AvailabilitySlot.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

export { AvailabilitySlot }; 