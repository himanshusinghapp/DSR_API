import { DataTypes, Model } from 'sequelize';
import sequelize from '@config/db';

class DSR extends Model {
    estimatedHour: any;
    description: any;
}

DSR.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  project: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estimatedHour: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      max: 8,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'DSR',
  tableName: 'dsrs',
  timestamps: true,
});

export default DSR;
