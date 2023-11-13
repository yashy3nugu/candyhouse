# NodeJS Version 16
FROM node:16.18-buster-slim

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN yarn install

# Set Env
ENV NODE_ENV production
EXPOSE 3000

# Cmd script
CMD ["yarn", "run", "start"]
