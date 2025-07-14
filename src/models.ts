import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
    Sequelize,
} from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/db.sqlite',
    logging: false,
});

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: string;
    declare username: string;
    declare avatar: string | null; // discord avatar
    declare displayName: string | null;
    declare avatarUrl: string | null;
    declare profileDesc: string | null;
    declare profileBanner: string | null;
    declare tagline: string | null;
    declare imageZoom: CreationOptional<number>;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        username: DataTypes.STRING,
        avatar: DataTypes.STRING,
        displayName: DataTypes.STRING,
        avatarUrl: DataTypes.STRING,
        profileDesc: DataTypes.TEXT,
        profileBanner: DataTypes.STRING,
        tagline: DataTypes.STRING,
        imageZoom: { type: DataTypes.FLOAT, defaultValue: 1 },
    },
    { sequelize, modelName: 'user' },
);

export class Collection extends Model<
    InferAttributes<Collection>,
    InferCreationAttributes<Collection>
> {
    declare id: CreationOptional<number>;
    declare slug: string;
    declare name: string;
    declare description: string | null;
    declare public: CreationOptional<boolean>;
    declare userId: string;
}

Collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        slug: {
            type: DataTypes.STRING,
        },
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        public: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        userId: DataTypes.STRING,
    },
    { sequelize, modelName: 'collection' },
);

export class Item extends Model<
    InferAttributes<Item>,
    InferCreationAttributes<Item>
> {
    declare id: string;
    declare title: string;
    declare desc: string | null;
    declare notes: string | null;
    declare flags: string | null;
    declare pricePaid: number | null;
    declare marketValue: number | null;
    declare images: string | null;
    declare category: string;
    declare userId: string;
    declare collectionId: number | null;
}

Item.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        title: DataTypes.STRING,
        desc: DataTypes.TEXT,
        notes: DataTypes.TEXT,
        flags: DataTypes.TEXT,
        pricePaid: DataTypes.FLOAT,
        marketValue: DataTypes.FLOAT,
        images: DataTypes.TEXT,
        category: DataTypes.STRING,
        userId: DataTypes.STRING,
        collectionId: DataTypes.INTEGER,
    },
    { sequelize, modelName: 'item' },
);

export class ProfileComment extends Model<
    InferAttributes<ProfileComment>,
    InferCreationAttributes<ProfileComment>
> {
    declare id: CreationOptional<number>;
    declare userId: string; // profile owner
    declare commenterId: string;
    declare content: string;
}

ProfileComment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: DataTypes.STRING,
        commenterId: DataTypes.STRING,
        content: DataTypes.TEXT,
    },
    { sequelize, modelName: 'profile_comment' },
);

User.hasMany(Collection, { foreignKey: 'userId' });
Collection.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Item, { foreignKey: 'userId' });
Item.belongsTo(User, { foreignKey: 'userId' });
Collection.hasMany(Item, { foreignKey: 'collectionId' });
Item.belongsTo(Collection, { foreignKey: 'collectionId' });
User.hasMany(ProfileComment, { foreignKey: 'userId' });
ProfileComment.belongsTo(User, { as: 'owner', foreignKey: 'userId' });
ProfileComment.belongsTo(User, { as: 'commenter', foreignKey: 'commenterId' });

export async function syncDb() {
    await sequelize.sync();
}
