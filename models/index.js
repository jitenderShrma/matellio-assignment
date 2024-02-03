const User = require('./User');
const Address = require('./Address');

User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Address };
