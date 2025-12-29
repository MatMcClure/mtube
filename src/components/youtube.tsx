export type YouTubeVideo = {
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
};
